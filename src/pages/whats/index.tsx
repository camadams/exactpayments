import React from "react";

const sendWhatsAppMessage = () => {
  // Replace with your WhatsApp number and message
  const phoneNumber = "+27835542241"; // Customer's phone number
  const message = "Hello, this is a test message!";

  // Create a WhatsApp deep link
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  // Open WhatsApp in a new tab
  window.open(whatsappLink, "_blank");
};

const App: React.FC = () => {
  return (
    <div>
      <h1>Send WhatsApp Message</h1>
      <button onClick={sendWhatsAppMessage}>Send Message</button>
    </div>
  );
};

export default App;
