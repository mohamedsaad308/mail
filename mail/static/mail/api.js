export const sendEmail = (recipients, subject, body) => {
  return fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  });
};

export const loadMailbox = (mailBox) => {
  return fetch(`/emails/${mailBox}`);
};

export const readEmail = (id) => {
  return fetch(`/emails/${id}`);
};

export const markRead = (id) => {
  return fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true,
    }),
  });
};
