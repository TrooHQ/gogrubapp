# --- build stage ---
FROM node:latest AS builder
WORKDIR /app
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
