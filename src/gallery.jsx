import Gallery_arr from "./gallery_ar";

function Gallery() {
  return (
    <section id="gallery" className="px-6 py-8">

      <h2 className="text-center text-3xl font-bold text-[#800000] mb-8">
        My Gallery
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">

        {Gallery_arr.map((photo, index) => (
          <img
            key={index}
            src={photo.image}
            alt={photo.alt}
            className="h-48 w-full object-cover"
          />
        ))}
    </div>
    <hr className="text-[#800000] text-lg font-bold my-3" />
    </section>
  );
}

export default Gallery;
