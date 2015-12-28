loadMessages(<?php echo $post->id; ?>,4);

	window.mutexLocalMessages = "unlock";
	setInterval(function(){
		
		if(window.mutexLocalMessages == "unlock")
		{
			window.mutexLocalMessages = "lock";
			var lastid = $(".timeline-messages .msg-time-chat:last-child").data("id");
			loadMessages(<?php echo $post->id; ?>,lastid);
		}
	}, 1000);
	
	
 $("#cnrForm").on("submit",function(e){
        e.preventDefault();
        e.stopPropagation();
        $("[name='message']").prop("readonly",true);
        var lastid = $(".timeline-messages .msg-time-chat:last-child").data("id");
        console.log(lastid);
        var data = $(this).serializeArray();
        var ajaxObject = $.post("<?php echo base_url('user'); ?>",data,null,"json");
        console.log(ajaxObject);
        ajaxObject.done(function(data){
            if(data == true)
            {
            	if(window.mutexLocalMessages == "unlock")
            	{
            		loadMessages(<?php echo $post->id; ?>,lastid);
                }
            	$("[name='message']").prop("readonly",false);
            	$("[name='message']").prop("value",null);
            }
        });

        ajaxObject.error(function(data){
            console.log(data);
        });
        
    });
