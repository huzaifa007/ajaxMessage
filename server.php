<?php 
    
    public function ajax_sendMessage()
    {
        util_isAjax(); // this is method checks if request is XMLHTTP or direct
        if($_POST)
        {
            $conversaton = $_POST;
            $session = userData('user_data'); // this function return the session stored data from user_data array
            $conversaton['user_id'] = $session['id'];
            $conversaton['status'] = 0;
            $result = $this->db->insert("conversations",$conversaton);
            if($result)
            {
                echo json_encode(true);
            }
            else
            {
                echo json_encode(false);
            }
        }
    }


    
    /**
     * This method is for loading messages and throwing back data in json format
     * 
     * */
    public function ajax_loadMessages()
    {
        util_isAjax();
        if($_POST)
        {
           $post_id = util_iPost('post_id'); // similar to $_POST['post_id']
           $last_id = util_iPost('last_id');
           $this->db->select("conversations.*,CONCAT(users.fname,' ',users.lname) as username,users.image",FALSE);
           $this->db->join("users","users.id = conversations.user_id","left");
           $this->db->where(array('conversations.post_id'=>$post_id,'conversations.id >'=>$last_id));
           $resultSet = $this->db->get("conversations");
           $html = "";
           foreach ($resultSet->result() as $row)
           {
               extract((array)$row);
               $image = base_url("assets/upload/user_photo/$image");
               $log_created = date("h:i a, M d Y", strtotime($log_created));
               $html .= <<<EOD
           <!-- Comment -->
           <div class="msg-time-chat" data-id="$id">
            <!--                                         <a class="message-img" href="javascript:void(0);"> -->
                <div class="message-img" style="width: 44px; height: 44px; overflow: hidden;">
                    <img alt="" style="width: 100% !important; height: auto !important;" src="$image" class="avatar">
                </div>
                <!--                                         </a> -->
                <div class="message-body msg-in">
                <span class="arrow"></span>
                    <div class="text">
                        <p class="attribution">
                            <a href="#">$username</a> at $log_created <!-- 1:55pm, 13th April 2013 -->
                        </p>
                        <p>$message</p>
                    </div>
                </div>
            </div>
            <!-- /comment -->
EOD;
           }
           echo json_encode(array('html'=>$html));
        }
    }
