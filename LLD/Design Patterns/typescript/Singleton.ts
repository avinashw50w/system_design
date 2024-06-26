class Singleton {
    private constructor() {}

    private static instance: Singleton;

    public static getInstance(): Singleton {
        if (!this.instance) {
            this.instance = new Singleton();
        }
        return this.instance;
    }
}

export default Singleton.getInstance();
