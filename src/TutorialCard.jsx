import tutorials from "./Tutorials";

function TutorialCard() {
return ( 
    <section id="tutorials" className="px-6 py-8"> 
    <h2 className="text-center text-3xl font-bold text-[#800000] mb-8">
        Featured Tutorials 
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {tutorials.map((tutorial, index) => (
        <div key={index} className="text-left">
            <img
                src={tutorial.image}
                alt="Tutorial"
                className="w-full h-40 object-cover"
            />

            <h3 className="mt-3 font-bold text-lg">
                {tutorial.title}
            </h3>

            <p className="mt-2 text-gray-600">
                Description: {tutorial.description}
            </p>

            <hr className="my-3" />

            <div className="flex justify-between">
            <span>{tutorial.rating}</span>
            <span>{tutorial.author}</span>
            </div>
        </div>
        ))}
    </div>
    </section>
);
}

export default TutorialCard;
