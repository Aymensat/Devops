# 1. THE BASE (The OS)
# We start with a lightweight version of Linux that has Node installed.
# "alpine" is a super tiny Linux distribution (5MB).
FROM node:18-alpine

# 2. THE SETUP (The Folder)
# Create a folder inside the container and go into it.
WORKDIR /app

# 3. THE DEPENDENCIES (The Smart Layering)
# We copy ONLY the package.json first.
COPY package*.json ./

# Then we install dependencies.
# If you don't change package.json, Docker "caches" this step (skips it next time).
RUN npm install

# 4. THE CODE (The App)
# Now we copy the rest of your source code into /app
COPY . .

# 5. THE PORT (Documentation)
# Tell Docker that this app listens on port 5000.
# (This doesn't actually open the port, it's just for documentation).
EXPOSE 5000

# 6. THE START COMMAND (The Action)
# What command should run when the container starts?
CMD ["node", "server.js"]