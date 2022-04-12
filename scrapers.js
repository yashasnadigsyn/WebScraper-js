const puppeteer = require('puppeteer');
const fs = require('fs');
const nodemailer = require('nodemailer');

async function scrape() {
    let dictoflinksandheadlines;
    let url = "https://www.opindia.com/category/politics/";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'load', timeout: 0});
    const bighead = await page.evaluate(() => {
            console.log('hi');
        const headlines = document.querySelectorAll(".entry-title.td-module-title a");
        let biglisty = [];
        headlines.forEach((tag) => {
          biglisty.push(`"${tag.innerHTML}"`);
          biglisty.push(`"${tag.href}"`);
      });
         return biglisty;  
    });
    browser.close();
    bighead.length = 50;
    let data = `<!DOCTYPE html>
<html>
<head><title>NEWS</title>
<style> body {
  background-color: lightblue;
}
table, th, td {
  border: 1px solid;
}
th, td {
  padding: 15px;
  text-align: left;
}</style>
<script>
window.addEventListener("load", function() {
   let datatable = [${bighead}];
   let html = "<table><tr>"
   let perrow = 2;
   for (let i=0; i<datatable.length; i++) {
       html += "<td>" + datatable[i] + "</td>";
       let next = i+1;
       if (next%perrow==0 && next != datatable.length) {
           html += "</tr><tr>"
    }
}
   html += "</tr><table>"
   document.getElementById("container").innerHTML = html;
});
</script>
</head>
<body> <div id="container"></div>
</body>
</html>`;
fs.writeFile('newslist.html', data, (err) => {
      
    // In case of a error throw err.
    if (err) throw err;
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
await sleep(10*1000);
let mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail',
    pass: 'yourpass'
  }
});
var mailOptions = {
  from: 'youremail',
  to: 'toemail',
  subject: 'News Delivery',
  attachments: {path:'newslist.html'}
};
 
mail.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
});


    return bighead;
    }
scrape();



