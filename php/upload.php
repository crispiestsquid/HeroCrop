<?php
   require 'aws/aws-autoloader.php';

   use Aws\S3\S3Client;

   $fileName = $_POST['fileName'];
   $base64Image = rawurldecode($_POST['base64Image']);
   $imageParts = explode(";base64,", $base64Image);
   $imageTypeAux = explode('image/', $imageParts[0]);
   $imagetype = $imageTypeAux[1];
   $decodedImage = base64_decode($imageParts[1]);

   $s3 = new Aws\S3\S3Client([
       'region' => 'us-east-1',
       'version' => 'latest',
   ]);

   // Send a PutObject request and get the result object.
   $result = $s3->putObject([
       'Bucket' => 'assets.oxfordclub.com',
       'Key' => 'emails/images/' . $fileName,
       'Body' => $decodedImage,
       'ContentType' => 'image/' . $imagetype
   ]);

   // Print the body of the result by indexing into the result object.
   echo $result['ObjectURL'];
?>