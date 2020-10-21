const contactManager = {
  displayWelcomeScreen: (res) => {
    res.write(`
        <div style="${contactManager.card}">
            <h1>Welcome to contact manager</h1>
            <p style="${contactManager.text}">An app to manage all your contacts</p>
        </div>
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
};

module.exports = contactManager;
