function track(){
    if(typeof(uid) != 'undefined'){
        $.get("/track",{'uid':uid, track_type:track_type, url:window.location.href}, function(){});
    }else{
        $.get("/track",{track_type:'general', url:window.location.href}, function(){});
    }
};

track();