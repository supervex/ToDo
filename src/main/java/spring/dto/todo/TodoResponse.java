package spring.dto.todo;

public class TodoResponse {
    private boolean success;
    private String message;

    public TodoResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    @Override
    public String toString() {
        return "TodoResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}
