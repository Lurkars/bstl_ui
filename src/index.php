<?php
  $config = array('base' => 'http://localhost/bstl/ui/', 'api' => 'http://localhost/bstl/api', 'debug' => true);
 ?>

<!DOCTYPE html>
<html ng-app="bstl_ui">
    <head>
		<meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <link rel="icon" href="favicon.ico">
        <script>
            window.bstlapi = "<?php echo $config['api']; ?>";
        </script>

        <link href="<?php echo $config['base']; ?>css/angular-material.min.css" type="text/css" rel="stylesheet"/>
        <link href="<?php echo $config['base']; ?>css/roboto.css" type="text/css" rel="stylesheet"/>
        <link href="<?php echo $config['base']; ?>css/material-icons.css" type="text/css" rel="stylesheet"/>
        <link href="<?php echo $config['base']; ?>css/font-awesome.min.css" type="text/css" rel="stylesheet"/>
        <link href="<?php echo $config['base']; ?>css/style.css" type="text/css" rel="stylesheet"/>

        <base href="<?php echo $config['base']; ?>">
        <title>{{page.title}}</title> 
    </head>
    <body ui-view>

        <script src="<?php echo $config['base']; ?>js/libs.js" type="text/javascript"></script>
	<?php if (isset($config['debug']) && $config['debug']) { ?>
		<script src="<?php echo $config['base']; ?>js/app.js" type="text/javascript"></script>
	<?php } else { ?>
		<script src="<?php echo $config['base']; ?>js/app.min.js" type="text/javascript"></script>
	<?php }; ?>
    </body>
</html>
