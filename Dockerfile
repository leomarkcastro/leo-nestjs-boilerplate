# Use the official Node.js 14 image as the base image
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json ./
COPY yarn.lock ./

# Install the dependencies
RUN yarn install --frozen-lockfile

# Copy the source code to the working directory
COPY . .

# Run Prisma generate to generate the Prisma client
RUN yarn prisma generate

# Build the NestJS application
RUN yarn build

# Use a lightweight Node.js 14 image as the base image for the final image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Expose the port on which the NestJS application will run
EXPOSE 3000

# Start the NestJS application
CMD ["node", "dist/main"]
