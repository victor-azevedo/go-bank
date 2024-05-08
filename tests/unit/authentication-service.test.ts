import bcrypt from "bcrypt";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../src/errors";
import { userRepository } from "../../src/repositories";
import { signIn, signUp } from "../../src/services/authentication-service";

jest.mock("../../src/repositories", () => ({
  userRepository: {
    findByCpf: jest.fn(),
    create: jest.fn(),
  },
}));

describe("AuthenticationService", () => {
  describe("signUp", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should throw ConflictError if CPF already exists", async () => {
      (userRepository.findByCpf as jest.Mock).mockResolvedValueOnce({});

      await expect(signUp({ name: "Test User", cpf: "12345678900", password: "password123" })).rejects.toThrow(
        ConflictError,
      );
    });

    test("should not throw error if CPF does not exist", async () => {
      (userRepository.findByCpf as jest.Mock).mockResolvedValueOnce(null);
      (userRepository.create as jest.Mock).mockResolvedValueOnce({});

      await expect(signUp({ name: "Test User", cpf: "12345678900", password: "password123" })).resolves.toBeUndefined();
    });
  });

  describe("signIn", () => {
    jest.mock("bcrypt", () => ({
      compare: jest.fn(),
    }));
    afterEach(() => {
      jest.clearAllMocks();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should throw NotFoundError if user does not exist", async () => {
      (userRepository.findByCpf as jest.Mock).mockResolvedValueOnce(null);

      await expect(signIn({ cpf: "12345678900", password: "password123" })).rejects.toThrow(NotFoundError);
    });

    test("should throw UnauthorizedError if password is invalid", async () => {
      (userRepository.findByCpf as jest.Mock).mockResolvedValueOnce({ password: "hashedPassword" });

      jest.mock("bcrypt", () => ({
        ...jest.requireActual("bcrypt"),
        compare: jest.fn().mockReturnValue(() => {
          false;
        }),
      }));

      await expect(signIn({ cpf: "12345678900", password: "wrongPassword" })).rejects.toThrow(UnauthorizedError);
    });

    test("should return token if user and password are correct", async () => {
      (userRepository.findByCpf as jest.Mock).mockResolvedValueOnce({ id: "userId", password: "hashedPassword" });

      jest.spyOn(bcrypt, "compare").mockResolvedValue(Promise.resolve(true) as never);

      const token = await signIn({ cpf: "12345678900", password: "correctPassword" });
      expect(token).toBeDefined();
    });
  });
});
