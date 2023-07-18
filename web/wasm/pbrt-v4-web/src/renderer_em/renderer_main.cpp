
#include <vector>

#include <emscripten/bind.h>

using std::vector;

struct Point3f {
    float x;
    float y;
    float z;
};

struct Triangle {
    Point3f v[3];
};

struct Mesh {
    vector<Triangle> triangles;
};

struct Scene {
    std::vector<Mesh> meshes;

    void add_mesh(const vector<Triangle> &triangles) {
        Mesh mesh;
        mesh.triangles = triangles;
        meshes.push_back(mesh);
    }
};

void create_mesh(const vector<Triangle> &triangles) {
    Mesh mesh;
}


Scene create_scene() {
    Scene scene;
    return scene;
}

int main() {
    Scene scene;
    return 0;
}



using namespace emscripten;

float lerp(float a, float b, float t) {
    return (1 - t) * a + t * b;
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("lerp", &lerp);
}
