package spring.dto.user;

public class UserLoginResponse {
    private boolean success;
    private String message;

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "UserLoginResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}
