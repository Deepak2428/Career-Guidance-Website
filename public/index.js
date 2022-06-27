
function passVisible(e)
{
    e.preventDefault();
    if($("#password").attr("type")=="password")
        var y=$('#password').attr("type","text");
    else
        $("#password").attr("type","password");
}

function dropdown()
{
    var div = document.getElementById('dropdown');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
    }
    else {
        div.style.display = 'block';
    }
}