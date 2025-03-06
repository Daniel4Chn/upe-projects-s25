document.getElementById("login_button").addEventListener("click", function() {
    console.log("test");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email);

    

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            window.location.href = data.redirect;
        }
    })
    .catch(error => {console.error("HELLO THIS IS AN ERROR")});
});
