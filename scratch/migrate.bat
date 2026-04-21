scp -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no C:\Users\Admin\Desktop\sanyog-app\scratch\drop_index.js ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com:~/sanyog-app/backend/drop_index.js
ssh -i "C:\Users\Admin\Desktop\Key\sanyog-key.pem" -o StrictHostKeyChecking=no ec2-user@ec2-98-83-43-29.compute-1.amazonaws.com "cd ~/sanyog-app/backend && node drop_index.js"
