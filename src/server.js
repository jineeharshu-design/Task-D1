require('dotenv').config() 

const cors = require('cors')
const express = require('express')
const https = require('https')
const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname));  // Serve static files from the current directory like CSS, JS, images, etc.

function brevoRequest(path, data) {    // sends a request to Brevo, path specifies which Brevo API endpoint to use, data contains the information sent to that endpoint.
    return new Promise((resolve, reject) => {    // Promise allows us to wait for the API response using await
        const jsonData = JSON.stringify(data)

        const options = {
            hostname: 'api.brevo.com',
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'Content-Length': Buffer.byteLength(jsonData)
            }
        }

        const request = https.request(options, (response) => {
            let responseData = ''

            response.on('data', (chunk) => {
                responseData += chunk
            })

            response.on('end', () => {
                resolve({
                    statusCode: response.statusCode,
                    body: responseData
                })
            })
        })

        request.on('error', reject)     // catches network errors

        request.setTimeout(15000, () => {
            request.destroy(new Error('Brevo request timed out.'))
        })

        request.write(jsonData)
        request.end()
    })
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


app.post('/subscribe', async (req, res) => {
    const email =
        typeof req.body.email === 'string'
            ? req.body.email.trim()
            : ''

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        //  / ... /	  Marks the beginning and end of the regex
        //  ^	      Start of the string
        //  [^\s@]+	  One or more characters that are not whitespace or @
        //  @	      Requires an @ symbol
        //  \.	      Requires a literal dot (.)
        //  $	      End of the string

    if (!email || !emailPattern.test(email)) {
        return res.status(400).send(
            'Please enter a valid email address.'
        )
    }

    if (
        !process.env.BREVO_API_KEY ||
        !process.env.BREVO_LIST_ID ||
        !process.env.BREVO_WELCOME_TEMPLATE_ID
    ) {
        console.error('Brevo environment variables are missing.')

        return res.status(500).send(
            'Email service is not configured.'
        )
    }

    try {
        // adds the user to the newsletter list
        const contactResult = await brevoRequest('/v3/contacts', {
            email: email,
            listIds: [Number(process.env.BREVO_LIST_ID)],
            updateEnabled: true
        })

        console.log(
            'Brevo Contact Status Code:',
            contactResult.statusCode
        )
        console.log('Brevo Contact Response:', contactResult.body)

        if (
            contactResult.statusCode < 200 ||
            contactResult.statusCode >= 300
        ) {
            return res.status(502).send(
                'Subscription failed. Please try again.'
            )
        }

        // sends the welcome email using my Brevo template
        const welcomeResult = await brevoRequest('/v3/smtp/email', {
            to: [{ email: email }],
            templateId: Number(
                process.env.BREVO_WELCOME_TEMPLATE_ID
            )
        })

        console.log(
            'Brevo Welcome Email Status Code:',
            welcomeResult.statusCode
        )
        console.log(
            'Brevo Welcome Email Response:',
            welcomeResult.body
        )

        if (
            welcomeResult.statusCode < 200 ||
            welcomeResult.statusCode >= 300
        ) {
            return res.status(502).send(
                'Subscribed successfully, but the welcome email could not be sent.'
            )
        }

        return res.status(200).send(
            'Successfully subscribed! Please check your inbox for your welcome email.'
        )
    } catch (error) {
        console.error('Newsletter request failed:', error.message)

        if (!res.headersSent) {
            return res.status(502).send(
                'Unable to contact the email service. Please try again.'
            )
        }
    }
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
