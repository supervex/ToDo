package spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spring.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserName(String userName);

    boolean existsByUserName(String userName);

    boolean existsByEmail(String email);
}
