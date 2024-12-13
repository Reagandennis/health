const Header = () => {
    return (
      <header className="bg-black py-4 px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Distributed Storage</h1>
          <nav>
            <ul className="flex space-x-6 text-white">
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#graphs">Graphs</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  };
  
  export default Header;
  