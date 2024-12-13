const Features = () => {
    return (
      <section id="features" className="py-20 px-8 bg-gray-900">
        <h2 className="text-3xl font-bold text-center text-white">Key Features</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center text-white">
            <h3 className="text-xl font-semibold">Scalable Storage</h3>
            <p className="mt-2">Easily scale your storage needs with no downtime.</p>
          </div>
          <div className="text-center text-white">
            <h3 className="text-xl font-semibold">Fault Tolerant</h3>
            <p className="mt-2">Our system ensures high availability even in failure scenarios.</p>
          </div>
          <div className="text-center text-white">
            <h3 className="text-xl font-semibold">Data Consistency</h3>
            <p className="mt-2">Guaranteed data consistency following the CAP theorem.</p>
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;
  