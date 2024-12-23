-- CreateIndex
CREATE INDEX "Inbox_id_idx" ON "Inbox"("id");

-- CreateIndex
CREATE INDEX "Inbox_senderId_receiverId_idx" ON "Inbox"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Likedby_userId_postId_idx" ON "Likedby"("userId", "postId");

-- CreateIndex
CREATE INDEX "Post_id_idx" ON "Post"("id");

-- CreateIndex
CREATE INDEX "Story_id_idx" ON "Story"("id");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
