let http = require('http');
let iconv = require('iconv-lite');
let cheerio = require('cheerio');
let fs = require("fs");
let path = require("path");

//请求网络获取响应
http.get('http://www.27270.com/ent/meinvtupian/', res => {
    var chucks = []
    res.on('data', (chuck) => {
        chucks.push(chuck)
    })

    res.on('end', () => {
        let html = iconv.decode(Buffer.concat(chucks), 'gbk');
        let extraDataFromHtml1 = extraDataFromHtml(html);
        downloadImg(extraDataFromHtml1)
    })
})

//从返回的页面HTML中提取数据
function extraDataFromHtml(html) {
    let newVar = [];
    const $ = cheerio.load(html);
    let arr = $('div .MeinvTuPianBox ul li a i img').toArray();
    for (let i = 0; i < arr.length; i++) {
        let obj = arr[i];
        let src = $(obj).attr('src');
        let title = $(obj).attr('alt');
        newVar.push({
            src,
            title
        })
    }
    return newVar
}

//下载图片数据
function downloadImg(data) {
    data.forEach(imgObj => {
        http.get(imgObj.src, (res) => {
            let join = path.join('./imgs',imgObj.title+path.extname(imgObj.src));
            let writeStream = fs.createWriteStream(join);
            res.pipe(writeStream)
        })
    })
}