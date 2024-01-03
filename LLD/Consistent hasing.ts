import crypto from "crypto";

class ConsistentHashing {
    private replicas: number;
    private algorithm: string;
    private ring: { [key: string]: any };
    private keys: string[];
    private nodes: string[];

    constructor(
        nodes: string[],
        replicas: number = 4,
        algorithm: string = "md5",
    ) {
        this.replicas = replicas;
        this.algorithm = algorithm;
        this.ring = {};
        this.keys = [];
        this.nodes = [];

        for (let i = 0; i < nodes.length; i++) {
            this.addNode(nodes[i]);
        }
    }

    addNode(node: string) {
        this.nodes.push(node);

        for (let i = 0; i < this.replicas; i++) {
            const key = this.crypto(node + ":" + i);

            this.keys.push(key);
            this.ring[key] = node;
        }

        this.keys.sort();
    }

    removeNode(node: string) {
        this.nodes = this.nodes.splice(this.nodes.indexOf(node), 1);

        for (let i = 0; i < this.replicas; i++) {
            const key = this.crypto(node + ":" + i);
            delete this.ring[key];

            this.keys.splice(this.keys.indexOf(key), 1);
        }
    }

    getNode(key: string) {
        if (this.getRingLength() == 0) return 0;

        const hash = this.crypto(key); //get hash of data/key
        const pos = this.getNodePosition(hash);

        return this.ring[this.keys[pos]];
    }

    getNodePosition(hash: string) {
        let upper = this.getRingLength() - 1;
        let lower = 0;
        let idx = 0;
        let comp = 0;

        if (upper == 0) return 0;

        while (lower <= upper) {
            idx = Math.floor((lower + upper) / 2);
            comp = this.compare(this.keys[idx], hash);

            if (comp == 0) {
                return idx;
            } else if (comp > 0) {
                upper = idx - 1;
            } else {
                lower = idx + 1;
            }
        }

        if (upper < 0) {
            upper = this.getRingLength() - 1;
        }

        return upper;
    }

    getRingLength() {
        return Object.keys(this.ring).length;
    }

    compare(v1: string, v2: string) {
        return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
    }

    crypto(str: string) {
        return crypto
            .createHash(this.algorithm)
            .update(str)
            .digest("hex");
    }
}

export default ConsistentHashing;
