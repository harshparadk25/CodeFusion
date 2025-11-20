import mongoose from "mongoose";

let bucket = null;

export function initBucket() {
  const db = mongoose.connection.db;

  if (!db) {
    console.error("❌ MongoDB not connected for GridFS");
    return;
  }

  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "files"
  });

  console.log("✅ GridFS bucket initialized (mongoose.mongo.GridFSBucket)");
}

export function getBucket() {
  return bucket;
}
