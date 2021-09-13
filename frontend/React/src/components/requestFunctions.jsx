export const baseUrl = "https://thenodesapi.concilbot.com/";

export async function sendData(endPoint, method, objData) {
  let res = await fetch(baseUrl + endPoint, {
    method: method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objData),
  });
  return await res.json();
}
export async function sendFile(endPoint, method, file) {
  const formData = new FormData();
  formData.append("filetoupload", file);

  let res = await fetch(baseUrl + endPoint, {
    method: method,
    body: formData,
  }).catch(function (error) {
    console.log("Looks like there was a problem: \n", error);
  });
  return await res.json();
}
