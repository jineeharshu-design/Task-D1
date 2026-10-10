import articles from "./Articles";

function ArticleCard() {
return ( 
    <section id="articles" className="px-6 py-8"> 
    <h2 className="text-center text-3xl font-bold text-[#800000] mb-8">
        Featured Articles 
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {articles.map((article, index) => (
        <div key={index} className="text-left">
            <img
            src={article.image}
            alt="Article"
            className="w-full h-40 object-cover"
            />

            <h3 className="mt-3 font-bold text-lg">
            {article.title}
            </h3>

            <p className="mt-2 text-gray-600">
            Description: {article.description}
            </p>

            <hr className="my-3" />

            <div className="flex justify-between">
            <span>{article.rating}</span>
            <span>{article.author}</span>
            </div>
        </div>
        ))}
    </div>
    </section>
);
}

export default ArticleCard;
