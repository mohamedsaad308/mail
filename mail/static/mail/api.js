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
