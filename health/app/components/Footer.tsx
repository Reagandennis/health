'use client'

const Footer = () => {
return (
    <footer id="contact" className="fixed bottom-0 w-full flex flex-col sm:flex-row gap-8 items-center justify-between px-6 sm:px-20 bg-[#2a9d8f] text-[#f3f7f4] py-6 text-center sm:text-left">
    <div>
        <h4 className="text-lg font-semibold">Contact Us</h4>
        <p>Email: <a href="mailto:info@psychologyservices.com" className="underline">info@psychologyservices.com</a></p>
        <p>Phone: <a href="tel:+1234567890" className="underline">+1 (234) 567-890</a></p>
    </div>
    <div>
        <h4 className="text-lg font-semibold">Visit Us</h4>
        <p>123 Wellness Way<br />Suite 100<br />Your City, State, ZIP</p>
        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="underline">Find us on Google Maps</a>
    </div>
    <div>
        <h4 className="text-lg font-semibold">Stay Connected</h4>
        <p>Follow us on our social platforms for updates and tips:</p>
        <div className="flex gap-4 justify-center sm:justify-start">
        <a href="#" className="hover:underline">Facebook</a>
        <a href="#" className="hover:underline">Twitter</a>
        <a href="#" className="hover:underline">Instagram</a>
        </div>
    </div>
    </footer>
)
}

export default Footer

