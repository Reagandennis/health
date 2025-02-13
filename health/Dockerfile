# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Set environment variables
ENV NODE_ENV=production

# Expose the Next.js default port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]
