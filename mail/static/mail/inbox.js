import { sendEmail } from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document.querySelector("#inbox").addEventListener("click", () => load_mailbox("inbox"));
  document.querySelector("#sent").addEventListener("click", () => load_mailbox("sent"));
  document.querySelector("#archived").addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);
  document.querySelector("#compose-form").addEventListener("submit", send_email);
  // By default, load the inbox
  load_mailbox("inbox");
});
function compose_email(recipients = "", subject = "", body = "") {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = recipients;
  document.querySelector("#compose-subject").value = subject;
  document.querySelector("#compose-body").value = body;
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function send_email(e) {
  e.preventDefault();
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;
  sendEmail(recipients, subject, body)
    .then((response) => response.json())
    .then((jsonResponse) => {
      console.log(jsonResponse);
      if ("error" in jsonResponse) {
        const element = document.createElement("div");
        element.className = "alert alert-danger wrong-email";
        element.innerHTML = jsonResponse.error;
        compose_email(recipients, subject, body);
        document.querySelector("#compose-view").append(element);
      } else {
        const errorMessage = document.querySelectorAll(".wrong-email");
        if (errorMessage) {
          errorMessage.forEach((e) => e.remove());
        }
        const element = document.createElement("div");
        element.className = "alert alert-success";
        element.innerHTML = jsonResponse.message;
        load_mailbox("sent");
        document.querySelector("#emails-view").append(element);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
