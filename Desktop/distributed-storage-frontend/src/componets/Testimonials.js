const Testimonials = () => {
    return (
      <section id="testimonials" className="py-20 px-8 bg-black text-white">
        <h2 className="text-3xl font-bold text-center">What Our Clients Say</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="text-center">
            <p className="italic">"This system changed the way we manage data!"</p>
            <p>- Client A</p>
          </div>
          <div className="text-center">
            <p className="italic">"A game-changer in terms of reliability and speed."</p>
            <p>- Client B</p>
          </div>
          <div className="text-center">
            <p className="italic">"Affordable and easy to integrate with our business."</p>
            <p>- Client C</p>
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  