//import logger for styles sharing
const logger = require("./logger");
const fs = require("fs");
const contactManager = {
  displayWelcomeScreen: (res) => {
    res.write(`
        <div style="${contactManager.card}">
            <h1>Welcome to contact manager</h1>
            <p style="${contactManager.text}">An app to manage all your contacts</p>
        </div>
        `);
  },

  displayAddContact: (res) => {
    res.write(`
    <form
    style="${logger.formStyles}"
    action="/contact-manager/add"
    method="POST"
>
    <input 
      name="name"
      style="${logger.formField}"
      type="text"
      placeholder="name">
      <input 
      name="email"
      style="${logger.formField}"
      type="email"
      placeholder="e-mail">
      <input 
      name="phone"
      style="${logger.formField}"
      type="phone"
      placeholder="phone">
    <button 
      style="${logger.formBtn}"
      type="submit">
      Add contact
    </button>
</form>
    `);
  },

  card: `
    text-align:center;
    padding: 1rem;
    display:block;
    margin:auto; 
    margin-top:2rem;
    background: blue;
    color: #fff;
    width:60%;
    max-width:600px;
    border: 15px solid #bbb;
    border-radius: 5px;
  `,

  text: `
  font-weight: 900;
  `,

  addContact: (req, res) => {
    const body = [];
    //on data to start reading data
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    //on end to finish reading stream
    req.on("end", () => {
      //parse data
      const parsedBody = Buffer.concat(body).toString();
      const name = parsedBody
        .split("&")[0]
        .split("=")[1]
        .split("+")
        .join(" ")
        .trim();
      const email = parsedBody
        .split("&")[1]
        .split("=")[1]
        .split("%")
        .join("")
        .trim();
      const phone = parsedBody.split("&")[2].split("=")[1].trim();
      const added = new Date()
        .toString()
        .replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, "$2-$1-$3");
      const contact = {
        name,
        email,
        phone,
        added,
      };
      const contactsDirectory = "./contacts";

      fs.readFile("./custom_modules/contacts.json", "utf8", (err, data) => {
        if (err) {
          throw err;
        }
        let resources;
        let objToWrite = {};
        let contacts;
        if (data !== "") {
          //some contacts already
          contacts = JSON.parse(data).contacts;
          contacts.push(contact);
          objToWrite.contacts = contacts;
        } else {
          //no contacts
          contacts = [];
          contacts.push(contact);
          objToWrite.contacts = contacts;
        }
        fs.writeFile(
          "./custom_modules/contacts.json",
          JSON.stringify(objToWrite),
          (err) => {}
        );
        //redirect back to contact-manager page
        res.statusCode = 302; //redirect
        res.setHeader("Location", "/contact-manager");
        res.end();
      });
    });
  },

  displayContacts: (res) => {
    fs.readFile("./custom_modules/contacts.json", "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      let contacts;
      if (data !== "") {
        contacts = JSON.parse(data).contacts;
      } else {
        contacts = null;
      }
      if (contacts === null) {
        res.write(`
    <div style="${contactManager.card}">
            <h1>No Contacts Here</h1> 
      `);
      } else {
        contacts.map((c) => {
          res.write(` 
          <div style=${contactManager.card};>
            <p>Name: ${c.name}</p>
            <p>E-mail: ${c.email} </p>
            <p>Phone: ${c.phone} </p>
            <p>Date added: ${c.added} </p>
            <p><a href="#">Delete Contact</a></p>
            <p><a href="#">Edit Contact</a></p>
          <hr style="max-width:15rem;">
        </div>
      `);
        });
      }
      res.end();
    });
  },
};

module.exports = contactManager;
