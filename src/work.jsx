import Work_arr from "./work_ar";

function Work() {
  return (
    <section id="work" className="text-[#800000] text-lg px-6 py-8 text-center">

      <h2 className="text-center text-3xl font-bold text-[#800000] mb-8">
        My Work
      </h2>

      {Work_arr.map((project, index) => (
        <div key={index} className="text-center">

          <img
            src={project.image}
            alt={project.title}
            className="my-6 w-full max-w-md mx-auto"
          />

          <h3 className="text-xl font-bold text-[#800000]">
            {project.title}
          </h3>

          <p className="mt-2 text-black">
            {project.description}
          </p>

          {project.link !== "#" && (
            <a
              href={project.link}
              className="text-[#800000]"
            >
              GitHub Link
            </a>
          )}
        </div>
    ))}
    <hr className="text-[#800000] text-lg font-bold my-3" />
    </section>
  );
}

export default Work;
