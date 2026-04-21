ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "sudo chown -R ec2-user:ec2-user ~/sanyog-app"
ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "tar -xzf ~/backend.tar.gz -C ~/sanyog-app/"
ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "cd ~/sanyog-app/backend && npm install --production"
ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "pm2 restart all || pm2 start server.js --name sanyog-backend"
