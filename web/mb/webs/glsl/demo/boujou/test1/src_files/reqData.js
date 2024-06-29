function reqData()
{
    // var url = "http://testopen.videoyi.com/webs/glsl/demo/boujou/test1/data/t3/res.txt";
    var url = "src_files/data/t3/res.txt";
    $.get(url, onGotData);

}


function onGotData(data, status)
{
    console.log(data);
}

reqData();