
	
	function loadMessages(post_id,last_id)
	{
		if(post_id != null && last_id != null)
		{
			var ajaxObject = $.post("<?php echo base_url("user/ajax_loadMessages") ?>",{ last_id : last_id , post_id : post_id },null,'json');
			ajaxObject.done(function(data){
				console.log(data.html);
				if(window.mutexLocalMessages == "unlock")
				{
					$(".timeline-messages").append(data.html);	
				}
			});
			ajaxObject.error(function(data){
			    console.log(data);
			});	
		}
		else
		{
			console.log ("invalid id");
		}
	}


	var x = "Your identical id";
	var y = "Starting From";
 	loadMessages(x,y);

	window.mutexLocalMessages = "unlock"; 
	/**
	 * This is global variable attached to window object, its purpose is to sent one request at a time. so the logic is
	 * if the variable value is unlock then request can proceed otherwise if its lock then request have to wait until its unlock
	*/
	
	// LoadMessages() will run every 1 seconds interval
	setInterval(function(){
		// if resource is unlock
		if(window.mutexLocalMessages == "unlock")
		{
			// lock the resource so that no other request can in
			window.mutexLocalMessages = "lock";
			var lastid = $(".timeline-messages .msg-time-chat:last-child").data("id"); // the id of last message shown in message list
			loadMessages(x,lastid);
		}
	}, 1000);
	
	
 $("#cnrForm").on("submit",function(e){
        e.preventDefault(); 
        e.stopPropagation();
        $("[name='message']").prop("readonly",true);
        var lastid = $(".timeline-messages .msg-time-chat:last-child").data("id");
        var data = $(this).serializeArray();
        var ajaxObject = $.post("<?php echo base_url('user'); ?>",data,null,"json");
        ajaxObject.done(function(data){
            if(data == true)
            {
            	// status is true mean all set but reload request is only required if its unlock
            	if(window.mutexLocalMessages == "unlock")
            	{
            		// lock the resource
            		window.mutexLocalMessages == "lock";
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
