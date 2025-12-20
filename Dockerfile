# --- build stage ---
FROM node:latest AS builder
WORKDIR /app
# Install xsel for clipboard operations
RUN apt-get update && apt-get install -y xsel && rm -rf /var/lib/apt/lists/*
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# --- runtime stage ---
FROM node:latest
WORKDIR /app
# Install a tiny static server
RUN yarn global add serve@14
# Copy only built assets
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
