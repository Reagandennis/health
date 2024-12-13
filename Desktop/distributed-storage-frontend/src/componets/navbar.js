export function navbar() {
    const navbar = document.createElement('nav');
    navbar.className = 'bg-gray-800 text-gray-100 shadow-md sticky top-0 z-50';
  
    const container = document.createElement('div');
    container.className = 'container mx-auto flex justify-between items-center py-4 px-6';
  
    const title = document.createElement('h1');
    title.className = 'text-2xl font-bold';
    title.textContent = 'Distributed Storage';
  
    const navList = document.createElement('ul');
    navList.className = 'flex space-x-6';
  
    const navItems = ['Home', 'Features', 'Graphs', 'Testimonials', 'Contact'];
    navItems.forEach((item) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${item.toLowerCase()}`;
      link.className = 'hover:text-blue-400';
      link.textContent = item;
  
      listItem.appendChild(link);
      navList.appendChild(listItem);
    });
  
    container.appendChild(title);
    container.appendChild(navList);
    navbar.appendChild(container);
  
    return navbar;
  }
  