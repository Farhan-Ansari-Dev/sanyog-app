ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "tar -xzf ~/backend.tar.gz -C ~/sanyog-app/ --overwrite"
ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "sudo tar -xzf ~/admin.tar.gz -C /var/www/admin-panel/"
ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "sudo tar -xzf ~/portal.tar.gz -C /var/www/portal/"
