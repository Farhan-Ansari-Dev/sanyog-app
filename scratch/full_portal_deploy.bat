tar -czf portal.tar.gz -C client-website/dist .
scp -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no portal.tar.gz ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com:~/
ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "sudo tar -xzf ~/portal.tar.gz -C /var/www/portal/ --overwrite && sudo chown -R ec2-user:ec2-user /var/www/portal && sudo chmod -R 755 /var/www/portal"
