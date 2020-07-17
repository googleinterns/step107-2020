package com.google.sps.data;

/** An item on a comment list. */
public final class Comment {
  private final String name;
  private final String message;
  private final long timestamp;
  private final String time;
  private final int schoolId;
  public static final String COMMENT_ENTITY = "Comment";
  public static final String NAME_KEY = "name";
  public static final String MESSAGE_KEY = "message";
  public static final String TIMESTAMP_KEY = "timestamp";
  public static final String TIME_KEY = "time";
  public static final String SCHOOL_ID_KEY = "schoolId";

  public Comment(String name, String message, long timestamp, String time, int schoolId) {
    this.name = name;
    this.message = message;
    this.timestamp = timestamp;
    this.time = time;
    this.schoolId = schoolId;
  }
}