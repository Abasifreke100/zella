export const Main = (content) => `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ExpressRyder</title>
  </head>
  <style>
    * {
      padding: 0;
      margin: 0;
    }
  </style>
  <body
    style="
      background-color: #eff1f4;
      padding: 30px 0;
      margin: 0;
      font-family: sans-serif;
    "
  >
    <div style="width: 600px; margin: 0 auto; padding: 30px 0">
      <div
        style="
          background-color: white;
          padding: 40px 40px;
          color: #032b69;
          margin-top: -5px;
          border-radius: 0 0 10px 10px;
        "
      >
        ${content}
      </div>
      
      <table
        style="
          width: 100%;
          max-width: 600px;
          margin: 15px 0;
          border-collapse: collapse;
          table-layout: fixed;
        "
      >
        <tr>
          <td colspan="2" style="padding: 0; text-align: end;  width: 33.3%;">
            <p style="font-size: 12px; color: #032b69; margin: 0">
              Copyright &copy; 2023
            </p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>

`;
