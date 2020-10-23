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
        .join("@")
        .trim();
      const phone = parsedBody.split("&")[2].split("=")[1].trim();
      const added = new Date()
        .toString()
        .replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, "$2-$1-$3");
      const id = Math.random().toString(12).substring(2, 17);
      const contact = {
        name,
        email,
        phone,
        added,
        id,
      };

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
          contacts.unshift(contact);
          objToWrite.contacts = contacts;
        } else {
          //no contacts
          contacts = [];
          contacts.unshift(contact);
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
        </div>
      `);
      } else {
        res.write(`<div style="${contactManager.card}">
          <h1>Current Contacts</h1> 
        </div>`);
        let id;
        contacts.map((c) => {
          res.write(` 
          <div style=${contactManager.card};>
            <p>Name: ${c.name}</p>
            <p>E-mail: ${c.email} </p>
            <p>Phone: ${c.phone} </p>
            <p>Date added: ${c.added} </p>
            <p><a href="#">Delete Contact</a></p>
            <p><a href="http://localhost:5000/contact-manager/edit" onclick="setCookie('${c.id}')" target="_blank">Edit Contact</a></p>
          <hr style="max-width:15rem;">
        </div>
      `);
        });
        res.write(`
        <script>
          //set cookie to client
            function setCookie(c){
              console.log(c)
              document.cookie = 'userId='+c;
            }
          </script>
        `);
      }
      res.end();
    });
  },

  renderEditContact: (res, userId) => {
    fs.readFile("./custom_modules/contacts.json", "utf8", (err, data) => {
      if (err) {
        throw err;
      }
      let contacts;
      if (data !== "") {
        contacts = JSON.parse(data).contacts;
        console.log(userId);
        contacts.map((c) => {
          if (c.id === userId) {
            res.write(`
            <form
            style="${logger.formStyles}"
            action="/contact-manager/edit"
            method="POST"
        >
            <input 
              name="name"
              style="${logger.formField}"
              value="${c.name}"
              type="text"
              placeholder="name">
              <input 
              name="email"
              style="${logger.formField}"
              type="email"
              value="${c.email}"
              placeholder="e-mail">
              <input 
              name="phone"
              style="${logger.formField}"
              type="phone"
              value="${c.phone}"
              placeholder="phone">
              <input type="hidden" value="${c.id}">
            <button 
              style="${logger.formBtn}"
              type="submit">
              Edit contact
            </button>
          </form>
            `);
          }
        });

        res.end();
      } else {
        res.write(`<div style="${contactManager.card}">
          <h1>Currently there are no Contacts to edit</h1> 
        </div>`);
        res.end();
      }
    });
  },

  editContact: (req, res, userId) => {
    console.log(`userID: ${userId}`);
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
        .join("@")
        .trim();

      const phone = parsedBody.split("&")[2].split("=")[1].trim();

      const added = new Date()
        .toString()
        .replace(/\S+\s(\S+)\s(\d+)\s(\d+)\s.*/, "$2-$1-$3");

      const newContact = {
        name,
        email,
        phone,
        added,
        id: userId,
      };

      fs.readFile("./custom_modules/contacts.json", "utf8", (err, data) => {
        if (err) {
          throw err;
        }

        let contacts;
        if (data !== "") {
          contacts = JSON.parse(data).contacts;
          contacts.map((c, index) => {
            console.log(c.id);

            if (c.id === newContact.id) {
              contacts.splice(index, 1, newContact);
              const objToWrite = { contacts };
              fs.writeFile(
                "./custom_modules/contacts.json",
                JSON.stringify(objToWrite),
                (err) => {}
              );
              //set content type

              //redirect back to contact-manager page
              res.statusCode = 302; //redirect
              res.setHeader("Location", "/contact-manager");
              res.end();
            }
          });
        } else {
          res.write(`<div style="${contactManager.card}">
            <h1>Currently there are no Contacts to edit</h1>
          </div>`);
          res.end();
        }
      });
    });
  },
};

module.exports = contactManager;
