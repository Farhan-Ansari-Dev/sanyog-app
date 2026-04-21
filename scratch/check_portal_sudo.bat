ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "sudo ls -la /var/www/portal"
ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "sudo tail -n 20 /var/log/nginx/error.log"
