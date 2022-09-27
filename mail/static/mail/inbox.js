import { sendEmail, loadMailbox, readEmail, markRead, archiveEmail } from "./api.js";

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
  document.querySelector("#read-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = typeof recipients === "string" ? recipients : "";
  document.querySelector("#compose-subject").value = subject;
  document.querySelector("#compose-body").value = body;
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#read-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  loadMailbox(mailbox)
    .then((res) => res.json())
    .then((jsonResponse) => {
      jsonResponse.forEach((e) => {
        const element = document.createElement("div");
        element.className = "row border border-dark email";
        if (e.read) {
          element.className += " read";
        } else {
          element.className += " not-read";
        }
        const sender = `<span> <strong>${e.sender}</strong></span>`;
        const timeStamp = `<span class="text-muted">${e.timestamp}</span>`;
        const subject = `<span class='ml-5'>${e.subject}</span>`;
        element.innerHTML = `         
        <div class="col-sm">${sender} ${subject}</div>
        <div class="col-sm timestamp">${timeStamp} </div>
        `;

        element.addEventListener("click", () => read_email(mailbox, e), false);
        document.querySelector("#emails-view").append(element);
      });
    });
}

function send_email(e) {
  e.preventDefault();
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#read-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;
  sendEmail(recipients, subject, body)
    .then((response) => response.json())
    .then((jsonResponse) => {
      // console.log(jsonResponse);
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

function read_email(mailbox, curr) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#read-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";
  if (!curr.read) {
    markRead(curr.id)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  }
  readEmail(curr.id)
    .then((res) => res.json())

    .then((result) => {
      document.querySelector(".email-from").innerHTML = result.sender;
      document.querySelector(".email-to").innerHTML = result.recipients.toString();
      document.querySelector(".email-subject").innerHTML = result.subject;
      document.querySelector(".email-timestamp").innerHTML = result.timestamp;
      document.querySelector(".email-body").innerHTML = result.body;
      const archiveButton = document.querySelector(".archive-email");
      const replyButton = document.querySelector(".reply-email");
      if (archiveButton && replyButton) {
        archiveButton.remove();
        replyButton.remove();
      }
      if (mailbox !== "sent") {
        const element = document.createElement("button");
        element.className = "btn btn-sm btn-outline-primary archive-email";
        element.id = `archive-email-${curr.id}`;
        element.innerHTML = mailbox === "archive" ? "Unarchive" : "Archive";

        const replyElement = document.createElement("button");
        replyElement.className = "btn btn-sm btn-outline-primary reply-email ml-2";
        replyElement.id = `reply-email-${curr.id}`;
        replyElement.innerHTML = "Reply";
        const recipients = curr.sender;
        const subject = curr.subject.startsWith("Re:") ? curr.subject : "Re:" + curr.subject;
        const body = `On ${curr.timestamp} ${curr.sender} wrote: ${curr.body}`;

        element.addEventListener("click", () => archive_email(result.id, !result.archived), false);
        document.querySelector("#email-info").append(element);

        replyElement.addEventListener("click", () => compose_email(recipients, subject, body));
        document.querySelector("#email-info").append(replyElement);
      }
    });
}

function archive_email(id, status, obj) {
  archiveEmail(id, status)
    .then((res) => {
      // console.log(res);
      load_mailbox("inbox");
    })
    .catch((error) => {
      console.log(error);
    });
}
