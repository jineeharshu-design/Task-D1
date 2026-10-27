function Banner() {
    return(
        <div className="relative group">
            <img src="images/deakin.png" 
                alt="deakin banner" 
                className="w-full block"
            /> 
            <div className="w-full absolute bottom-0 text-amber-100 text-center opacity-0 group-hover:opacity-100">
                Hey, I'm Harshita Yadav
            </div>
        </div>
    )
}

export default Banner
