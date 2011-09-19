$(document).ready(function(){

    $("a.edit_user").live("click", function(){
        var container = $(".user_info");
        container.toggle();
        $("a.edit_user.action").toggle();
    });

    $("div#inlined_fields_container .actions .add_more").click(function() {
        $("div.inlined_fields.to_clone").clone(true).insertBefore("#inlined_fields_container .actions").removeClass('to_clone').show();
        return false;
    });

    $("div#inlined_fields_container .inlined_fields .remove").click(function() {
        if(confirm("Are you sure?")){
            $(this).parent().remove();
        }
    });

});