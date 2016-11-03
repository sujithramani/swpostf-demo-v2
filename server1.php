<?php
date_default_timezone_set('Asia/Kolkata');
$applicationId=$_GET['applicationId'];
$districtCode=$_GET['districtCode'];
$talukCode=$_GET['talukCode'];

 //$datastring = $_POST['json'];
//echo "test=>".stripslashes_deep($datastring);
//echo "tes1t=>".urldecode(str_replace("\\","",$datastring));
 //$result_arr = json_decode($datastring, true);
//print_r($result_arr);
/*
$the_data['Status Response']['channels']['title'] = $title;
$the_data['Status Response']['channels']['link'] = $link;
$the_data['Status Response']['Status']= $desc;*/

//echo json_encode($the_data);

$date=date("d/m/Y h:i:s");

if ($applicationId == "12345" && $districtCode == "12" && $talukCode == "1") {
	$json = '{
	"StatusResponse": {
		"DomainName": "Revenue Court Case Status",
		"APIVersion": "1.0",
		"ListVersion": "1.0",
		"Banner": {
			"Image": "http://otg.nic.in/image/logo.jpg"
		},
		"Footer": {
			"Image": "http://otg.nic.in/image/footer.jpg"
		},
		"Status": [
		{
			"Label" : "Application ID",
			"Value" : "'.$applicationId.'"
			},
			{
			"Label" : "Name",
			"Value" : "Anna"
			},
			{
			"Label" : "Status",
			"Value" : "Completed",
			"Class" : "green"
			},
			{
			"Label" : "Download",
			"Value" : "Download Order",
			"Href" : "http://10.163.14.63/project/v14/latestv2/cert-community_0_0.pdf"
			}				
		]
	}
}';

/*   
echo '<table data-role="table" class="ui-responsive ui-shadow">
       <tr><td>Application ID</td><td>'.$appid.'</td></tr>
       <tr><td>Name</td><td>Anna</td></tr>
       <tr><td>DOB</td><td>'.$dob.'</td></tr>
       <tr><td>Status</td><td>Approved</td></tr>
       <tr><td>Processed Date</td><td>1/1/2015 10:49:20</td></tr>
       <tr><td>Status as On</td><td>'.date("d/m/Y h:i:s").'</td></tr>
       </table>'; */
   }
   
   else {
   	
   		$json = '{
	"StatusResponse": {
		"DomainName": "Revenue Court Case Status",
		"APIVersion": "1.0",
		"ListVersion": "1.0",
		"Banner": {
			"Image": "http://otg.nic.in/image/logo.jpg"
		},
		"Footer": {
			"Image": "http://otg.nic.in/image/footer.jpg"
		},
		"Status": [
		{
			"Label" : "Application ID",
			"Value" : "'.$applicationId.'",
			"Class" : "green"
			},
		{
			"Label" : "Error",
			"Value" : "Invalid Application ID",
			"Class" : "error"
			}
		]
	}
}';
   	
   	   	
   /*	echo '<table data-role="table" class="ui-responsive ui-shadow">
       <tr><td><span style="color:red; font-size:15px; font-weigth:bold;">Invalid Application ID and Date Of Birth</span></td></tr>
       </table>';*/
   	
   	}
   	
   $jArr = json_decode($json, true);
   echo json_encode($jArr);
?>
