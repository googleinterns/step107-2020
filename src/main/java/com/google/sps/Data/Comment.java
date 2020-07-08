package com.google.sps.data;

/** An item on a comment list. */
public final class Comment {
  private final String name;
  private final String message;
  private final long timestamp;
  private final String time;
  public static final String NAME_KEY = "name";
  public static final String MESSAGE_KEY = "message";
  public static final String TIMESTAMP_KEY = "timestamp";
  public static final String TIME_KEY = "time";

  public Comment(String name, String message, long timestamp, String time) {
    this.name = name;
    this.message = message;
    this.timestamp = timestamp;
    this.time = time;
  }
}